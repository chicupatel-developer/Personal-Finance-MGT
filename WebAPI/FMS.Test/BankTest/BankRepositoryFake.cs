using FMS.Entity.Context.Models;
using FMS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FMS.Test.BankTest
{
    public class BankRepositoryFake : IBankRepository
    {
        private readonly List<Bank> _banks;
        Random rnd = new Random();
        public BankRepositoryFake()
        {
            _banks = new List<Bank>()
            {
                new Bank() { 
                     // BankId = rnd.Next(1, 10),
                     BankId = 1,
                      BankName = "CIBC"
                },
                new Bank() {
                     // BankId = rnd.Next(1, 10),
                     BankId = 2,
                      BankName = "TD"
                },
                new Bank() {
                     // BankId = rnd.Next(1, 10),
                     BankId = 3,
                      BankName = "RBC"
                }
            };
        }
        public IEnumerable<Bank> GetAllBanks()
        {
            return _banks;
        }
        public Bank AddBank(Bank newBank)
        {
            _banks.Add(newBank);
            return newBank;
        }
        public Bank GetBank(int bankId)
        {
            return _banks.Where(a => a.BankId == bankId)
                .FirstOrDefault();
        }
        public Bank EditBank(Bank bank)
        {
            var result = _banks.Where(x => x.BankId == bank.BankId).FirstOrDefault();
            if (result != null)
            {
                result.BankName = bank.BankName;
                return bank;
            }
            else
            {
                return null;
            }
        }
    }
}
