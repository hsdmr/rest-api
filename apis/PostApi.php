<?php

namespace Hasdemir\Rest;

use Hasdemir\Rest\Codes;
use Hasdemir\Base\Log;
use Hasdemir\Base\Rest;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Post;
use Respect\Validation\Validator as v;

class PostApi extends Rest
{
  const HELPER_LINK = ['link' => 'post'];

  public function search($request, $args)
  {
    Log::currentJob(Codes::JOB_POST_SEARCH);
    try {
      $post = new Post();
      $this->body = $post->all();
      return $this->response(HTTP_OK);
    } finally {
      Log::endJob();
    }
  }

  public function create($request, $args)
  {
    Log::currentJob(Codes::JOB_POST_CREATE);
    try {
      $_POST = json_decode($request->body(), true);

      $this->validate($_POST);

      $post = new Post();
      $this->body = $post->create([
        'slug_id' => $_POST['slug_id'],
        'user_id' => $_POST['user_id'] ?? 1,
        'file_id' => $_POST['file_id'] ?? null,
        'status' => $_POST['status'] ?? 'published',
        'title' => $_POST['title'] ?? 'Post_' . uniqid(),
        'content' => $_POST['content'] ?? '',
      ])->toArray();
      return $this->response(HTTP_CREATED);
    } finally {
      Log::endJob();
    }
  }

  public function read($request, $args)
  {
    Log::currentJob(Codes::JOB_POST_READ);
    try {
      try {
        $post_id = $args['post_id'];

        $post = Post::find($post_id);
        $response = $post->toArray();
        $response['categories'] = $post->categories();
        $response['slug'] = $post->slug();
        $this->body = $response;
        return $this->response(HTTP_OK);
      } catch (\Throwable $th) {
        throw new NotFoundException('Post not found', self::HELPER_LINK, $th);
      }
    } finally {
      Log::endJob();
    }
  }

  public function update($request, $args)
  {
    Log::currentJob(Codes::JOB_POST_UPDATE);
    try {
      $_PUT = json_decode($request->body(), true);
      $post_id = $args['post_id'];

      $this->validate($_PUT);

      $post = Post::find($post_id);
      $this->body = $post->update([
        'slug_id' => $_PUT['slug_id'],
        'user_id' => $_PUT['user_id'] ?? 1,
        'file_id' => $_PUT['file_id'] ?? null,
        'status' => $_PUT['status'] ?? 'published',
        'title' => $_PUT['title'] ?? 'Post_' . uniqid(),
        'content' => $_PUT['content'] ?? '',
      ])->toArray();
      return $this->response(HTTP_OK);
    } finally {
      Log::endJob();
    }
  }

  public function delete($request, $args)
  {
    Log::currentJob(Codes::JOB_POST_DELETE);
    try {
      $post_id = $args['post_id'];

      if (Post::find($post_id)->delete()) {
        $this->response(HTTP_NO_CONTENT);
      }
    } finally {
      Log::endJob();
    }
  }

  public function validate($params)
  {
    if (!v::key('slug_id', v::positive())->validate($params)) {
      throw new UnexpectedValueException("'slug_id' must be positive number", self::HELPER_LINK);
    }
    if (!v::key('user_id', v::positive())->validate($params)) {
      throw new UnexpectedValueException("'user_id'  must be positive number", self::HELPER_LINK);
    }
    if (!v::key('status', v::in(['published', 'draft']))->validate($params)) {
      throw new UnexpectedValueException("'status' only can be 'published' or 'draft'", self::HELPER_LINK);
    }
  }
}
