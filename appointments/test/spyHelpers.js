export const fetchResponseOk = (status = 500,body ={}) =>
  Promise.resolve({
    ok: true,
    status ,
    json: () => Promise.resolve(body)
  });

export const fetchResponseError = () =>
  Promise.resolve({ ok: false });

export const fetchRequestBodyOf = fetchSpy =>
  JSON.parse(fetchSpy.mock.calls[0][1].body);

export const requestBodyOf = fetchSpy =>
  fetchRequestBodyOf(fetchSpy);
