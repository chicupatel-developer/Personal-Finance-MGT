using FMS.Entity.Context.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.Interfaces
{
    public interface ISourceRepository
    {
        IEnumerable<Source> GetAllSources();
        BankTransaction BankInputFromSource(BankTransaction bankTransaction);
    }
}
