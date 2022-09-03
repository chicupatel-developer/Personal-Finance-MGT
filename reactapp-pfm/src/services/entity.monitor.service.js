import http from "../axios/entity-monitor-http-common";

class EntityMonitorService {
  monitorAccountMonthly = async (data) => {
    return await http.post(`/monitorAccountMonthly`, data);
  };
}
export default new EntityMonitorService();
