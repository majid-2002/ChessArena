export async function get(url: string) {
  try {
    const response = await fetch(url);
    if (response.status > 300) {
      throw response;
    } else {
      return response.json();
    }
  } catch (e) {
    throw await (e as { json: () => Promise<unknown> }).json();
  }
}

export async function post(
  url: RequestInfo,
  kwargs: FormData | Record<string, unknown> = {},
  headers = {}
) {
  const isFormdata = kwargs instanceof FormData;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(isFormdata ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: isFormdata ? kwargs : JSON.stringify(kwargs),
    });
    if (response.status > 300) {
      throw response;
    } else {
      return response.json();
    }
  } catch (e) {
    throw await (e as { json: () => Promise<unknown> }).json();
  }
}
