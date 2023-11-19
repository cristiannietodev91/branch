import React from "react";
import Chat from "../../components/Chat/Chat";
import { WorkShopStackScreenProps } from "../../../types/types";

export default function ChatCita(props: WorkShopStackScreenProps<"Chat">) {
  const { route } = props;
  const { IdTaller } = route.params;
  return <Chat IdTaller={IdTaller} />;
}
