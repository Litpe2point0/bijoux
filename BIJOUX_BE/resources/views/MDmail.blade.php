<x-mail::message>
# {{$data['subject']}}

{{$data['messageContent']}}

<x-mail::panel>
<b>
{{$data['security_code']}}
</b>
</x-mail::panel>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>