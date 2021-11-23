using FMS.Entity.Context;
using FMS.Entity.Context.Models;
using FMS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;


namespace FMS.Service.Repositories
{
    public class BankRepository : IBankRepository
    {
        private readonly FMSContext appDbContext;

        public BankRepository(FMSContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IEnumerable<Bank> GetAllBanks()
        {
            return appDbContext.Banks;
        }

        public Bank AddBank(Bank bank)
        {
            var result = appDbContext.Banks.Add(bank);
            appDbContext.SaveChanges();
            return result.Entity;
        }

        public Bank GetBank(int bankId)
        {
            return appDbContext.Banks.Where(x => x.BankId == bankId).FirstOrDefault();
        }

        public Bank EditBank(Bank bank)
        {
            var result = appDbContext.Banks.Where(x => x.BankId == bank.BankId).FirstOrDefault();
            if (result != null)
            {
                result.BankName = bank.BankName;

                appDbContext.SaveChanges();
                return bank;

                // check for null
                // return null;
            }
            else
            {
                return null;
            }
        }
    }
}
