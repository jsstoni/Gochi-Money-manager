const priceFormat = (price) => {
  price = price || 0;
  const precioFormateado = price.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    currencySymbol: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    minimumIntegerDigits: 1,
    useGrouping: true,
  });
  return precioFormateado;
};

const singleNumbers = (e) => {
  if (
    ![8, 9, 27, 13, 110, 190].includes(e.keyCode) &&
    (e.keyCode < 48 || e.keyCode > 57) &&
    (e.keyCode < 96 || e.keyCode > 105)
  ) {
    e.preventDefault();
  }
};

const updateWalletAmount = (balance, amount, transactionType) => {
  balance = parseInt(balance) || 0;
  amount = parseInt(amount);
  const total = transactionType == 1 ? balance + amount : balance - amount;
  return total;
};

export { priceFormat, singleNumbers, updateWalletAmount };
