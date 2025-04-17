<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class {{requestName}} extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            {{#each rules}}
            {{#if this.isUploadedFile}}'uploaded_{{this.name}}'{{else}}'{{this.name}}'{{/if}}=> '{{arrayToLaravelRules this.rule}}', 
            {{/each}}
        ];
    }
}
