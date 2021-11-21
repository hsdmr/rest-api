<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Log;
use Hasdemir\Exception\StoragePdoException;
use Hasdemir\Model\Category;
use Hasdemir\Exception\UnexpectedValueException;
use Respect\Validation\Validator as v;

class CategoryApi extends BaseApi
{
    const HELPER_LINK = ['link' => 'category'];

    public function search($request, $args)
    {
        Log::currentJob('category-search');
        try {
            $category = new Category();
            $this->body = $category->all();
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function create($request, $args)
    {
        Log::currentJob('category-create');
        try {
            $_POST = json_decode($request->body(), true);
            $this->validate($_POST);
            $category = new Category();
            $this->body = $category->create([
                'permalink_id' => $_POST['permalink_id'],
                'file_id' => $_POST['file_id'] ?? null,
                'parent_id' => $_POST['parent_id'] ?? null,
                'owner' => $_POST['owner'],
                'title' => $_POST['title'] ?? 'Category-' . uniqid(),
                'content' => $_POST['content'] ?? '',
            ])->toArray();
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function read($request, $args)
    {
        Log::currentJob('category-read');
        try {
            try {
                $category_id = $args[0];

                $this->body = Category::findById($category_id)->toArray();
                $this->response(200);
            } catch (\Throwable $th) {
                throw new StoragePdoException('Category not found', self::HELPER_LINK, $th);
            }
        } finally {
            Log::endJob();
        }
    }

    public function update($request, $args)
    {
        Log::currentJob('category-update');
        try {
            $_PUT = json_decode($request->body(), true);
            $category_id = $args[0];

            $this->validate($_PUT);
            
            $category = Category::findById($category_id);
            $this->body = $category->update([
                'permalink_id' => $_PUT['permalink_id'],
                'file_id' => $_PUT['file_id'] ?? null,
                'parent_id' => $_PUT['parent_id'] ?? null,
                'owner' => $_PUT['owner'],
                'title' => $_PUT['title'] ?? 'Category-' . uniqid(),
                'content' => $_PUT['content'] ?? '',
            ])->toArray();
            $this->response(200);
        } finally {
            Log::endJob();
        }
    }

    public function delete($request, $args)
    {
        Log::currentJob('category-delete');
        try {
            $category_id = $args[0];

            if (Category::findById($category_id)->delete()) {
                $this->response(200);
            }
        } finally {
            Log::endJob();
        }
    }

    public function validate($params)
    {
        if (!v::key('permalink_id', v::positive())->validate($params)) {
            throw new UnexpectedValueException("'permalink_id' must be positive number", self::HELPER_LINK);
        }
        if (!v::key('owner', v::in(['post', 'product', 'lesson']))->validate($params)) {
            throw new UnexpectedValueException("'owner' must be 'post', 'product', 'lesson'", self::HELPER_LINK);
        }
        if (!v::key('file_id', v::anyOf(v::nullType(), v::positive()), false)->validate($params)) {
            throw new UnexpectedValueException("'file_id' must be positive number", self::HELPER_LINK);
        }
        if (!v::key('parent_id', v::anyOf(v::nullType(), v::positive()), false)->validate($params)) {
            throw new UnexpectedValueException("'parent_id' must be positive number", self::HELPER_LINK);
        }
    }
}
