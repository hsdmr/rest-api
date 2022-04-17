<?php

namespace Hasdemir\Controller;

use Hasdemir\Controller\Codes;
use Hasdemir\Base\Log;
use Hasdemir\Base\Controller;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\UnexpectedValueException;
use Hasdemir\Model\Option;
use Respect\Validation\Validator as v;

class OptionController extends Controller
{
  public function search($request, $args)
  {
    Log::currentJob(Codes::JOB_OPTION_SEARCH);
    try {
      $params = $request->params();

      if (!v::key('get', v::in(['one', 'many']))->validate($params)) {
        throw new UnexpectedValueException("'get' must be 'one' or 'many'", Codes::key(Codes::ERROR_GET_NOT_ALLOWED));
      }

      $this->validate($params);

      if ($params['get'] == 'one') {
        $response = Option::findOption($params['type'], $params['type_id'] ?? null, $params['key']);

        if (!$response) {
          throw new NotFoundException('Option not found!', Codes::key(Codes::ERROR_OPTION_NOT_FOUND));
        }
      }
      else {
        $response = Option::findOptions($params['type'], $params['type_id'] ?? null);

        if (!$response) {
          throw new NotFoundException('Options not found!', Codes::key(Codes::ERROR_OPTIONS_NOT_FOUND));
        }
      }

      $this->body = $response;
      $this->response(HTTP_OK);
    }
    finally {
      Log::endJob();
    }
  }

  public function create($request, $args)
  {
    Log::currentJob(Codes::JOB_OPTION_CREATE);
    try {
      $_POST = json_decode($request->body(), true);
      $this->validate($_POST);

      $response = Option::createOption($_POST['type'], $_POST['type_id'], $_POST['key'], $_POST['value']);

      $this->body = $response;
      $this->response(HTTP_CREATED);
    }
    finally {
      Log::endJob();
    }
  }

  public function delete($request, $args)
  {
    Log::currentJob(Codes::JOB_OPTION_DELETE);
    try {
      $option_id = $args['option_id'];

      if (Option::find($option_id)->delete()) {
        $this->response(HTTP_NO_CONTENT);
      }
    }
    finally {
      Log::endJob();
    }
  }

  public function validate($params): void
  {
    if (!v::key('type', v::stringType())->validate($params)) {
      throw new UnexpectedValueException("'type' must be string", Codes::key(Codes::ERROR_TYPE_MUST_BE_STRING));
    }

    if (!v::key('type_id', v::intType(), false)->validate($params)) {
      throw new UnexpectedValueException("'type_id' must be integer", Codes::key(Codes::ERROR_TYPE_ID_MUST_BE_INTEGER));
    }

    if (!v::key('key', v::stringType(), false)->validate($params)) {
      throw new UnexpectedValueException("'key' must be string", Codes::key(Codes::ERROR_KEY_MUST_BE_STRING));
    }
  }
}
