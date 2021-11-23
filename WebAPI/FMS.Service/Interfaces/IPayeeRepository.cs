using FMS.Entity.Context.Models;
using FMS.Service.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.Interfaces
{
    public interface IPayeeRepository
    {
        IEnumerable<Payee> GetAllPayees();
        Payee AddPayee(Payee payee);
        List<string> GetAllPayeeTypes();
        IEnumerable<Payee> GetAllPayeesCC();
    }
}
