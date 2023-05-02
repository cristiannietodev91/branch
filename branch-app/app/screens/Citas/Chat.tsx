import React from "react";
import { ActiveAppointmentStackScreenProps } from "../../../types/types";
import Chat from "../../components/Chat/Chat";

export default function ChatCita(
  props: ActiveAppointmentStackScreenProps<"Chat">
) {
  const { route } = props;
  return <Chat IdTaller={route.params.IdTaller} />;
}
