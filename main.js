//HTTP REQUEST GETALL GETONE PUT POST DELETE
const URL_REQUEST = 'http://localhost:3000/posts'
async function GetData() {
    try {
        let res = await fetch(URL_REQUEST);
        let posts = await res.json();
        
        let body_of_table = document.getElementById('table-body')
        body_of_table.innerHTML = "";
        for (const post of posts) {
            body_of_table.innerHTML +=
                `<tr>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td><input type='submit' onclick='Delete(${post.id})' value='Delete'/></td>
            </tr>`
        }
    } catch (error) {
        console.log(error);
    }
}
// nếu id không tồn tai -> tạo mới
//id tồn tại thì sử dụng put 
async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("views_txt").value;
    let resAnItem = await fetch(URL_REQUEST + '/' + id);
    let res;
    if (resAnItem.ok) {//ton tai roi - PUT
        res = await fetch(URL_REQUEST + '/' + id,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "appilication/json"
                },
                body: JSON.stringify({
                    title: title,
                    views: views
                })
            }
        );
    } else {
        res = await fetch(URL_REQUEST,
            {
                method: "POST",
                headers: {
                    "Content-Type": "appilication/json"
                },
                body: JSON.stringify({
                    id: id,
                    title: title,
                    views: views
                })
            }
        );

    }
    if (!res.ok) {
        console.log("bi loi");
    }
    GetData();
    return false;
}
async function Delete(id) {
    let res = await fetch(URL_REQUEST + '/' + id, {
        method: 'delete'
    });
    if (res.ok) {
        console.log("xoa thanh cong");
    }
}
GetData()
