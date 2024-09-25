async function getTasks(course_id) {
    try {
        // 使用await调用fetch
        const response = await fetch(`https://courses.zju.edu.cn/api/courses/${course_id}/activities?sub_course_id=0`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": `https://courses.zju.edu.cn/course/${course_id}/content`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

        // 检查响应状态
        if (!response.ok) {
            throw new Error(`getTasks HTTP error! status: ${response.status}`);
        }

        // 解析JSON数据
        const data = await response.json();

        // 返回解析后的数据
        return data.activities;
    } catch (error) {
        // 处理错误
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function doTask(course_id, task_id, max_second=60*20) {
    try {
        let begin_second = 0
        while (begin_second + 120 <= max_second) {
            // 使用await调用fetch
            const response = await fetch(`https://courses.zju.edu.cn/api/course/activities-read/${task_id}`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6",
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": `https://courses.zju.edu.cn/course/${course_id}/learning-activity/full-screen`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": `{"start":${begin_second},"end":${begin_second+120}}`,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });

            // 检查响应状态
            if (!response.ok) {
                throw new Error(`doTask HTTP error! status: ${response.status}`);
            }
            begin_second += 120
        }
    } catch (error) {
        // 处理错误
        console.error('There was a problem with the fetch operation:', error);
    }
}

let course_id = (window.location.href.match(/\/course\/(\d+)/))[1];

(await getTasks(course_id)).forEach(async (task)=>{
    await doTask(course_id,task.id)
});
