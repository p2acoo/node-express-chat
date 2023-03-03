const sampleForm = document.getElementById("register-form");
sampleForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let form = e.currentTarget;
    let url = form.action;

    try {
        let formData = new FormData(form);
        let responseData = await postFormFieldsAsJson({ url, formData });

        if (responseData.status == 201) {
            window.location.href = "/front-end/auth/login";
        } else {
            alert("Error");
        }

        let { serverDataResponse } = responseData;

        console.log(serverDataResponse);
    } catch (error) {
        console.error(error);
    }
});

async function postFormFieldsAsJson({ url, formData }) {
    let formDataObject = Object.fromEntries(formData.entries());
    let formDataJsonString = JSON.stringify(formDataObject);

    let fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: formDataJsonString,
    };
    let res = await fetch(url, fetchOptions);

    return res
}