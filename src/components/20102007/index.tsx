import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import { Audio } from "expo-av";
import { getUrlBaseBackend } from "@/utils/api";

export default function L20102007() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // volume từ 0.0 đến 1.0
  const [isMuted, setIsMuted] = useState(false);

  const playSound = async () => {
    if (sound && isPlaying) {
      await sound.stopAsync();
      setIsPlaying(false);
      return;
    }

    const audioUrl = `${getUrlBaseBackend()}/audio/20102007.mp3`;

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true, volume, isMuted }
    );
    setSound(newSound);
    setIsPlaying(true);
  };

  const increaseVolume = async () => {
    const newVolume = Math.min(volume + 0.1, 1);
    setVolume(newVolume);
    if (sound) await sound.setVolumeAsync(newVolume);
  };

  const decreaseVolume = async () => {
    const newVolume = Math.max(volume - 0.1, 0);
    setVolume(newVolume);
    if (sound) await sound.setVolumeAsync(newVolume);
  };

  const toggleMute = async () => {
    const newMuteStatus = !isMuted;
    setIsMuted(newMuteStatus);
    if (sound) await sound.setIsMutedAsync(newMuteStatus);
  };

  return (
    <View style={{ marginTop: 50, alignItems: "center" }}>
      <Button
        title={isPlaying ? "Stop Music" : "Play Music"}
        onPress={playSound}
      />

      <Text style={{ marginTop: 10 }}>
        Volume: {(volume * 100).toFixed(0)}%
      </Text>

      <View style={{ flexDirection: "row", marginVertical: 10 }}>
        <Button title="🔉 -" onPress={decreaseVolume} />
        <View style={{ width: 10 }} />
        <Button title="🔊 +" onPress={increaseVolume} />
      </View>

      <Button title={isMuted ? "🔇 Unmute" : "🔈 Mute"} onPress={toggleMute} />
    </View>
  );
}
