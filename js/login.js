// 程式碼來自 https://www.jianshu.com/p/b5a9b8d74d38
function setCookie(name, value, expdays) {
    var expdate = new Date();
    //設置 Cookie 過期日期
    expdate.setDate(expdate.getDate() + expdays);
    //添加 Cookie
    document.cookie = name + "=" + escape(value) + ";expires=" + expdate.toUTCString();
}

function getCookie(name) {
    //獲取 name 在 Cookie 中起止位置
    var start = document.cookie.indexOf(name + "=");

    if (start != -1) {
        start = start + name.length + 1;
        //獲取 value 的終止位置
        var end = document.cookie.indexOf(";", start);
        if (end == -1)
            end = document.cookie.length;
        //截獲 cookie 的 value 值,並返回
        return unescape(document.cookie.substring(start, end));
    }
    return "";
}

function delCookie(name) {
    setCookie(name, "", -1);
}

function check() {
    //獲取 form 表單輸入:使用者名稱,密碼,是否保存密碼
    var username = document.getElementById("userID").value.trim();
    var password = document.getElementById("userPASS").value.trim();
    var isRmbPwd = document.getElementById("isRmbPwd").checked;

    //判斷使用者名稱,密碼是否為空(全空格也算空)
    if (username.length != 0 && password.length != 0) {
        //若複選框勾選,則添加 Cookie,記錄密碼
        if (isRmbPwd == true) {
            setCookie("This is username", username, 7);
            setCookie(username, password, 7);
        }
        //否則清除Cookie
        else {
            delCookie("This is username");
            delCookie(username);
        }
        return true;
    }
    //非法輸入提示
    else {
        alert('請正確填寫內容')
        return false;
    }
}
//將 function 函數賦值給 onload 對象
window.onload = function() {
    //從 Cookie 獲取到使用者名稱
    var username = getCookie("This is username");
    //如果使用者名稱為空,則給 form 元素賦空值
    if (username == "") {
        document.getElementById("userID").value = "";
        document.getElementById("userPASS").value = "";
        document.getElementById("isRmbPwd").checked = false;
    }
    //獲取對應的密碼,並把使用者名稱,密碼賦值給 form
    else {
        var password = getCookie(username);

        document.getElementById("userID").value = username;
        document.getElementById("userPASS").value = password;
        document.getElementById("isRmbPwd").checked = true;
    }
}