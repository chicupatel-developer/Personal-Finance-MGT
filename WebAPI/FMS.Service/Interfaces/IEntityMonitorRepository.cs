using FMS.Entity.Context;
using FMS.Entity.Context.Models;
using FMS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using FMS.Service.DTOs;

namespace FMS.Service.Interfaces
{
    public interface IEntityMonitorRepository
    {
        IEnumerable<AccountMonthly> MonitorAccountMonthly(AccountMonthlyRequest accountMonthlyRequest);
    }
}
