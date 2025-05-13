export interface RecordingState {
    isRecording: boolean;
    audioBlob?: Blob;
    audioUrl?: string;
}

export class AudioRecorder {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private stream: MediaStream | null = null;

    async startRecording(): Promise<void> {
        try {
            // Request access to the microphone
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create a new MediaRecorder instance
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];

            // Set up event handlers
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            // Start recording
            this.mediaRecorder.start();
        } catch (error) {
            console.error('Error starting recording:', error);
            throw new Error('Falha ao iniciar gravação. Por favor, verifique as permissões do microfone.');
        }
    }

    async stopRecording(): Promise<{ audioBlob: Blob; audioUrl: string }> {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder) {
                reject(new Error('Gravador não inicializado.'));
                return;
            }

            this.mediaRecorder.onstop = () => {
                // Create a Blob from the recorded audio chunks
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

                // Create a URL for the Blob
                const audioUrl = URL.createObjectURL(audioBlob);

                // Stop all tracks in the stream
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                    this.stream = null;
                }

                resolve({ audioBlob, audioUrl });
            };

            // Stop recording
            this.mediaRecorder.stop();
        });
    }

    cancelRecording(): void {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        // Stop all tracks in the stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        this.audioChunks = [];
    }
}
