using FMS.Entity.Context.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.Interfaces
{
    public interface IBankRepository
    {
        IEnumerable<Bank> GetAllBanks();
        Bank AddBank(Bank bank);
        Bank GetBank(int bankId);
        Bank EditBank(Bank bank);        
    }
}
