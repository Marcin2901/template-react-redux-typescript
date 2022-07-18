// A mock function to mimic making an async request for data


// zwracamy promisa który wykona się po .5 sekundy i tak naprawde to zwróci mu przekazany argument
// tylko że pod nazwą data
export function fetchCount(amount = 1) {
  return new Promise<{ data: number }>((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}
