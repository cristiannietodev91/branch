import React from "react";
import { ActiveAppoinmentStackScreenProps } from "../../../types/types";
import Chat from "../../components/Chat/Chat";

export default function ChatCita(
  props: ActiveAppoinmentStackScreenProps<"Chat">
) {
  const { route } = props;
  return <Chat IdTaller={route.params.IdTaller} />;
}
