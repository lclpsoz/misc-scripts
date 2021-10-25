export default function compareDate(a, b) {
  if (a.amount > b.amount)
    return -1;
  if (a.amount < b.amount)
    return 1;
  if (a.date.split('/').reverse().join('-') < b.date.split('/').reverse().join('-'))
    return -1;
  if (a.date.split('/').reverse().join('-') > b.date.split('/').reverse().join('-'))
    return 1;
  return 0;
}