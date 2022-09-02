export function getBankColor(bankName) {
  if (bankName.search("CIBC") !== -1) {
    return "lightsalmon";
  } else if (bankName.search("TD") !== -1) {
    return "lightgreen";
  } else if (bankName.search("RBC") !== -1) {
    return "lightsteelblue";
  } else if (bankName.search("Scotia") !== -1) {
    return "lightpink";
  } else {
    return "white";
  }
}

export function getCCColor(ccName) {
  if (ccName.search("visa") !== -1) {
    return "orange";
  } else if (ccName.search("master card") !== -1) {
    return "blue";
  } else {
    return "black";
  }
}

export function getAccountType(ac) {
  if (ac === 0) return "Chequing";
  if (ac === 1) return "Savings";
  if (ac === 2) return "TFSA";
}

export function getAccountColor(acType) {
  if (acType === 0) return "green";
  if (acType === 1) return "blue";
  if (acType === 2) return "red";
}

export function getPayeeIcon(payeeType) {
  if (payeeType === 0) {
    return "bi bi-phone-fill";
  }
  if (payeeType === 1) {
    return "bi bi-lightbulb";
  }
  if (payeeType === 2) {
    return "bi bi-house";
  }
  if (payeeType === 3) {
    return "bi bi-credit-card";
  }
  if (payeeType === 4) {
    return "bi bi-asterisk";
  }
  if (payeeType === 5) {
    return "bi bi-cart4";
  }
  if (payeeType === 6) {
    return "bi bi-cart3";
  }
  if (payeeType === 7) {
    return "bi bi-gear";
  }
  if (payeeType === 8) {
    return "bi bi-speedometer2";
  }
  if (payeeType === 9) {
    return "bi bi-cup-straw";
  }
  if (payeeType === 10) {
    return "bi bi-hourglass-top";
  }
  if (payeeType === 11) {
    return "bi bi-hourglass-bottom";
  } else return "bi bi-brightness-high-fill";
}
export function getPayeeTypeName(payeeType) {
  if (payeeType === 0) {
    return "Phone";
  }
  if (payeeType === 1) {
    return "Hydro";
  }
  if (payeeType === 2) {
    return "Rent";
  }
  if (payeeType === 3) {
    return "CreditCard";
  }
  if (payeeType === 4) {
    return "WallMart";
  }
  if (payeeType === 5) {
    return "SuperStore";
  }
  if (payeeType === 6) {
    return "BombaySpices";
  }
  if (payeeType === 7) {
    return "CanadianTire";
  }
  if (payeeType === 8) {
    return "CarService";
  }
  if (payeeType === 9) {
    return "TimHortons";
  }
  if (payeeType === 10) {
    return "Medicine_WalMart";
  }
  if (payeeType === 11) {
    return "Medicine_SuperStore";
  } else return "Others";
}

export function getAmountSign(transactionType) {
  if (transactionType === 1) {
    return "-";
  }
  if (transactionType === 0) {
    return "+";
  }
}
export function getTransactionTypeDisplay(transactionType) {
  if (transactionType === 0) return "In";
  if (transactionType === 1) return "Out";
}

export function getCCTypeColor(ccName) {
  if (ccName.toLowerCase().search("visa") !== -1) {
    return "orange";
  } else if (ccName.toLowerCase().search("master") !== -1) {
    return "blue";
  } else {
    return "black";
  }
}

export function getDaysDifference(startDate, endDate) {
  if (startDate.getTime() === endDate.getTime()) return 1;
  let difference = endDate.getTime() - startDate.getTime();
  let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return totalDays;
}

export function getMaxDate(transactions) {
  return new Date(
    Math.max(
      ...transactions.map((element) => {
        return new Date(element.transactionDate);
      })
    )
  );
}
export function getMinDate(transactions) {
  return new Date(
    Math.min(
      ...transactions.map((element) => {
        return new Date(element.transactionDate);
      })
    )
  );
}

export function getMyTransactions(bankAccounts) {
  var allTransactions = [];
  bankAccounts.map((ba) => {
    ba.transactions.map((tr) => {
      console.log(tr);
      allTransactions.push(tr);
    });
  });
  return allTransactions;
}

// filter by payee
export function getMyFilterTransactions(bankAccounts, payee) {
  var filterTransactions = [];
  bankAccounts.map((ba) => {
    ba.transactions.map((tr) => {
      console.log(tr);
      if (Number(tr.payeeId) === Number(payee)) {
        filterTransactions.push(tr);
      }
    });
  });
  return filterTransactions;
}

// filter by dates
export function getMyFilterTransactionsByDates(transactions, startDate, endDate) {
  var filterTransactions = [];
  transactions.map((tr) => {
    console.log(tr);
     if (
       new Date(tr.transactionDate) >= new Date(startDate) &&
       new Date(tr.transactionDate) <= new Date(endDate)
     ) {
       filterTransactions.push(tr);
     }
  });
  return filterTransactions;
}