const baseOptions = {
    credentials: 'same-origin',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
}

const postOptions = {
    method: 'POST',
    ...baseOptions,
};


export const FetchFoursquare = (data) => {
    return fetch(`/api/fq?`, {
        ...postOptions,
        body: JSON.stringify(data),
    })
    .then(response => {
        return new Promise((resolve, reject) => {
            if (response.ok) {
                resolve(response.json());
            } else {
                reject(response);
            }
        });
    }).catch((e) => {
        Promise.reject(e);
    });
};
