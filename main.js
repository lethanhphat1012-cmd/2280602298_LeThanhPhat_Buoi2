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
                <td style="
                    text-decoration: ${post.isDeleted ? 'line-through' : 'none'};
                    color: ${post.isDeleted ? 'gray' : 'black'};
                ">
                    ${post.title}
                </td>
                <td>${post.views}</td>
                <td><input type='submit' onclick='Delete("${post.id}")' value='Delete'/></td>
            </tr>`
        }
    } catch (error) {
        console.log(error);
    }
}
// nếu id không tồn tai -> tạo mới
//id tồn tại thì sử dụng put 
async function Save() {
    let id = document.getElementById("id_txt").value.trim();
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("views_txt").value;

    let resAll = await fetch(URL_REQUEST);
    let posts = await resAll.json();

    let res;

    if (id !== "") {
        // UPDATE
        let oldPost = await fetch(URL_REQUEST + "/" + id);
        let oldData = await oldPost.json();

        res = await fetch(URL_REQUEST + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...oldData,
                id: id,
                title: title,
                views: views
            })
        });

    } else {
        // CREATE (ID tự tăng CHUẨN)
        let validIds = posts
    .map(p => p.id)
    .filter(id => /^\d+$/.test(id)) // chỉ lấy số thật

let maxId = validIds.length > 0 ? Math.max(...validIds.map(Number)) : 0;

        let newId = (maxId + 1).toString();

        res = await fetch(URL_REQUEST, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: newId, // BẮT BUỘC phải có dòng này
                title: title,
                views: views,
                isDeleted: false
            })
        });
    }

    GetData();
}
async function Delete(id) {
    let res = await fetch(URL_REQUEST + '/' + id);

    if (res.ok) {
        let post = await res.json();

        await fetch(URL_REQUEST + '/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: true
            })
        });

        console.log("Đã xoá mềm");
        GetData();
    }
}

async function GetComments(postId) {
    let res = await fetch(`http://localhost:3000/comments?postId=${postId}`);
    let comments = await res.json();

    let html = "";
    comments.forEach(c => {
        html += `<p>${c.text}</p>`;
    });

    document.getElementById("comments").innerHTML = html;
}

async function AddComment() {
    let text = document.getElementById("comment_txt").value;
    let postId = document.getElementById("postId_txt").value;

    // VALIDATE
    if (!postId) {
        alert("Phải nhập Post ID!");
        return;
    }

    let res = await fetch("http://localhost:3000/comments");
    let comments = await res.json();

    let maxId = 0;

    comments.forEach(c => {
        if (!isNaN(c.id)) {
            maxId = Math.max(maxId, parseInt(c.id));
        }
    });

    let newId = (maxId + 1).toString();

    await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: newId,
            text: text,
            postId: postId // QUAN TRỌNG
        })
    });

    GetComments();
}
async function DeleteComment(id, postId) {
    await fetch(`http://localhost:3000/comments/${id}`, {
        method: "DELETE"
    });

    GetComments(postId);
}

async function UpdateComment(id, newText, postId) {
    await fetch(`http://localhost:3000/comments/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: newText,
            postId: postId
        })
    });

    GetComments(postId);
}
GetData()
