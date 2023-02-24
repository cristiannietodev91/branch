const data = [
  {
    id: "dashboards",
    icon: "iconsminds-statistic",
    label: "menu.dashboards",
    to: "/app/dashboards",
    subs: [
      {
        icon: "simple-icon-pie-chart",
        label: "menu.analytics",
        to: "/app/dashboards/taller"
      }
    ]
  },
  {
    id: "talleres",
    icon: "iconsminds-wrench",
    label: "menu.taller",
    to: "/app/taller",
    notifications: true,
    subs: [
      {
        icon: "simple-icon-list",
        label: "branch.taller.listaTalleres",
        to: "/app/taller/listTalleres"
      },
      {
        icon: "simple-icon-briefcase",
        label: "menu.detailTaller",
        to: "/app/taller/detailTaller"
      },
      {
        icon: "simple-icon-people",
        label: "menu.listClients",
        to: "/app/taller/listClients"
      },
      {
        icon: "simple-icon-people",
        label: "menu.chats",
        to: "/app/taller/listChats",
        notifications: true
      }
    ]
  }
];
export default data;
