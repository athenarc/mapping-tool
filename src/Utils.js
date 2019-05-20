export const fetchData = (url) => {
    return fetch(url)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw Error(`Failed to fetch: ${res.status}`)
        })
}

export const postData = (url, data, type = 'POST') => {
    return fetch(url, {
        method: type, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
}
export const getExcel = (url, data, name) => {

    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    return fetch(url, {
        method: 'POST',
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            // 'X-Authorization': 'Bearer ' + getJwtToken()
        }
    })
        .then(function (resp) {
            return resp.blob();
        }).then(function (blob) {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = name + "_" + datetime + ".xlsx";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();
        });

}