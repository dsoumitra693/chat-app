import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { IFileType } from "@/types";
import { Colors } from "@/constants/Colors";
import DocumentViewer from "./DocumentViewer";
import { AudioPlayer } from "./AudioPlayer";
import { VideoPlayer } from "./VideoPlayer";
import { ImageDisplay } from "./ImageDisplay";

interface IDisplayFile {
  type: IFileType;
  url: string;
  self: boolean;
}

const DisplayFile: React.FC<IDisplayFile> = ({ type, url, self }) => {
  switch (type) {
    case "Image":
      return <ImageDisplay url={url} />;

    case "Audio":
      return (
        <AudioPlayer
          url={url}
          color={Colors.dark[self ? "background" : "tint"]}
        />
      );

    case "Video":
      return <VideoPlayer url={url} />;

    case "None":
      return <></>;

    case "Document":
      return <DocumentViewer url={url} />;

    default:
      return (
        <View>
          <Text>Unsupported file type</Text>
        </View>
      );
  }
};



export default DisplayFile;

const styles = StyleSheet.create({
  videoWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: 300,
    height: 300,
    marginBottom: 5,
    borderRadius: 15,
  },
  icon: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
  },
  audioContainer: {
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    backgroundColor: Colors["dark"].tint,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    color: Colors["dark"].text,
    fontWeight: "bold",
  },
  waveForm: {
    width: 200,
    height: 30,
    justifyContent: "center",
    padding: 10,
  },
});
