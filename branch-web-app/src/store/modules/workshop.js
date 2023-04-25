import ServiceCore from "../../services/service";
import { workshopStages } from "../../utils/constants";

const state = {
  infoWorkshop: null,
  workOrders: localStorage.getItem("workOrders") != null
  ? JSON.parse(localStorage.getItem("workOrders"))
  : [],
  error: null,
};

const getters = {
  workOrders: (state) => state.workOrders,
  workshopInfo: (state) => state.infoWorkshop,
  workshopMechanics: (state) => state.infoWorkshop?.mecanicos || [],
  workOrdersByOrderCode: (_, getters) => getters.workOrders.reduce((group, curr) => {
    const { CodigoOrden } = curr;
    group[CodigoOrden] = group[CodigoOrden] ?? [];
    group[CodigoOrden].push(curr);
    return group;
  }, {}),
  workOrdersByOrderCodeAndStages: (_, getters) => Object.keys(getters.workOrdersByOrderCode).reduce((acc, key) => {
    const workOrder = getters.workOrdersByOrderCode[key];
    return {
      ...acc,
      [key]: {
        IdCita: workOrder[0].IdCita,
        IdTaller: workOrder[0].IdTaller,
        CodigoOrden: workOrder[0].CodigoOrden,
        IdVehiculo: workOrder[0].IdVehiculo,
        kilometraje: workOrder[0].kilometraje,
        vehiculo: workOrder[0].vehiculo, 
        etapas: workshopStages.reduce(
          (acc, stage) => ({
            ...acc,
            [stage.name]:
              workOrder.find((order) => order.IdEtapa === stage.IdEtapa) || null
          }),
          {}
        )
      }
    };
  }, {}),
};

const mutations = {
  setWorkshopInfo: (state, payload) => {
    state.infoWorkshop = payload;
  },
  setWorkOrders: (state, payload) => {
    state.workOrders = payload.workOrders;
    localStorage.setItem("workOrders", JSON.stringify(payload.workOrders))
  },
  setWorkshopError: (state, payload) => {
    state.error = payload;
  },
  addWorkOrder: (state, payload) => {
    state.workOrders.push(payload);
  }
};

const actions = {
  loadWorkshop: ({ commit, rootState }) => {
    const { user } = rootState;
    const { currentUser } = user;
    if (currentUser && currentUser.IdTaller) {
      ServiceCore.getTallerById(currentUser.IdTaller).then((response) => {
        if (response.status == 200) {
          commit("setWorkshopInfo", response.data);
        }
      });
      ServiceCore.getOrdenesByIdTallerAndFilter(currentUser.IdTaller)
        .then(async (response) => {
          if (response.status == 200) {
            commit("setWorkOrders", { workOrders: response.data });
          }
        })
        .catch((error) => {
          commit("setWorkshopError", error.response.data.error);
        });
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
