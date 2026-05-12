import { useCallback, useRef, useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const VolumeIndicator = ({ volume }: { volume: number }) => (
  <motion.div
    className="absolute inset-0 bg-red-500 opacity-10"
    animate={{
      scale: [1, 1 + volume * 0.5, 1],
      opacity: [0.1, 0.3, 0.1],
    }}
    transition={{
      repeat: Infinity,
      duration: 0.8,
    }}
  />
);

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInputButton = ({
  onTranscript,
  disabled = false,
}: VoiceInputButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const recognitionRef = useRef<any>(null);
  const animationRef = useRef<number>(null);

  const toggleVoiceInput = useCallback(() => {
    if (disabled) {
      toast.info("Voice input is disabled");
      return;
    }

    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice input is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop?.();
      setIsListening(false);
      setVolume(0);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      onTranscript(transcript);
    };

    recognition.onerror = () => {
      toast.error("Voice recognition error");
      setIsListening(false);
      setVolume(0);
    };

    recognition.onend = () => {
      setIsListening(false);
      setVolume(0);
    };

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 32;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mic = audioContext.createMediaStreamSource(stream);
        mic.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const update = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setVolume(Math.min((avg / 255) * 1.5, 1));
          animationRef.current = requestAnimationFrame(update);
        };

        update();
      })
      .catch(() => toast.error("Failed to access microphone"));

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, disabled, onTranscript]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={toggleVoiceInput}
      className="relative overflow-hidden mt-[2px] -ml-1"
      disabled={disabled}
    >
      {isListening ? (
        <MicOff className="text-red-500" />
      ) : (
        <Mic className="text-stone-400" />
      )}
      {isListening && <VolumeIndicator volume={volume} />}
    </Button>
  );
};
