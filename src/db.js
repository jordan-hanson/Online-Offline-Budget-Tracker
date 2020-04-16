let db;

const request = indexedDB.open("budget", 1)
console.log('THis is request in DB fiel should be index db budget stuff', request)

request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function (event) {
    console.log("Nope! " + event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");

    const store = transaction.objectStore("pending");

    store.add(record);
}

function checkDatabase() {
    console.log('THis is our db variable', db)

    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(() => {
                    const transaction = db.transaction(["pending"], "readwrite");
                    const store = transaction.objectStore("pending");
                    store.clear();
                });
        }
    };
}


window.addEventListener("online", checkDatabase);