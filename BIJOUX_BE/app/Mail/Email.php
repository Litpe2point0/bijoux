<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class Email extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $messageContent;
    public $subject;
    public $pathToFile;
    /**
     * Create a new message instance.
     */
    public function __construct($messageContent, $subject, $pathToFile)
    {
        $this->messageContent = $messageContent;
        $this->subject = $subject;
        $this->pathToFile = $pathToFile;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('bijouxjewelryoriginal@gmail.com', 'Bijoux'),
            subject: $this->subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        if($this->pathToFile == null){
            return [];
        }
        return [
            Attachment::fromPath($this->pathToFile),
        ];
    }
}
