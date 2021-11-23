using System;
using System.Collections.Generic;
using System.Text;

namespace FMS.Service.CustomException
{
    public class AccountNotFound : Exception
    {
        public AccountNotFound(string message) : base(message)
        {

        }
    }
}
