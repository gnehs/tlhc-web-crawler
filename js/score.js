$(document).ready(function () {
    $("table").removeAttr('style')
    $("[data-table] tr:last-child").remove()
    $("[data-table=\"rank\"]").removeClass("first line")
    $('td').removeAttr('class')
    $(`[data-table="rank"] tr td:nth-child(1n+2)`).addClass("score")
    $(`[data-table="total"] tr td:nth-child(1n+2)`).addClass("score")
    $('[data-table=\"score\"] td,[data-table=\"day\"] td,[data-table=\"rewards\"] td').html(function () {
        var text = $(this).text().trim();
        if (text < 60 && text > 0 || text == '0') {
            // 不及格
            $(this).addClass('negative')
        }
        if (text <= 100 && text >= 80) {
            // 八十分
            $(this).addClass('positive')
        }
        if (text <= 100 && text >= 0) {
            // 如果是分數，加上等寬字元
            $(this).addClass('score')
        }
        if (text.match(/大功|小功|嘉獎/)) {
            // 棒棒
            $(this).addClass('positive')
        }
        if (text.match(/曠課|遲到|升降旗缺席|小過|警告|缺點/)) {
            // 壞壞
            $(this).addClass('negative')
        }
        if (text.match(/成績輸入期間|成績處理期間/)) {
            var text = "";
        }
        return text
    })
    $(`[data-table="score"] td:last-child`).removeClass('negative positive') //移除學分上的正負面 class
    $('[data-table="rank"] td,[data-table="total"] td').html(function () {
        var text = $(this).text().trim();
        if (text.match(/成績輸入期間|成績處理期間/)) {
            return ""
        }
        return text
    })
    // 匯出資料
    if ($("table")) {
        let downloadDiv = `<div class="mdui-row-xs-2">`
        let date = new Date().toLocaleString('zh-TW').replace(/ /, "_")
        $("table").each(function (i) {
            downloadDiv += `
             <div class="mdui-col">
                <a href="${exportReportTableToCSV($(this), '匯出.csv')}"
                    download="${$(this).attr('data-name')}_${date}_ㄉㄌㄐㄕ匯出.csv"
                    class="mdui-btn mdui-color-theme mdui-btn-block mdui-ripple"
                    style="margin:0 4px 4px 0">
                    ${$(this).attr('data-name')}
                </a>
             </div>
             `
        })
        downloadDiv += `</div>`
        $('#export').html(downloadDiv)
    }
});

// https://stackoverflow.com/questions/24610694/export-html-table-to-csv-in-google-chrome-browser/24611096
function exportReportTableToCSV($table, filename) {
    var dumpd = '';
    var csvData = '';
    $table.each(function () {
        var $rows = $(this).find('tr:has(td)');
        var $header = $(this).find('tr:has(th)');

        tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character

            colDelim = '","',
            rowDelim = '"\r\n"',

            csv = '"' + $header.map(function (i, head) {
                var $head = $(head),
                    $cols = $head.find('th');

                return $cols.map(function (j, col) {
                    var $col = $(col),
                        text = $col.text();

                    if (text == "&nbsp;")
                        text = "";
                    if (text == "PROGRAMS")
                        text = "";
                    return text.replace('"', '""');

                }).get().join(tmpColDelim);

            }).get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim) + '"';

        csv += '\r\n';

        csv += '"' + $rows.map(function (i, row) {
                var $row = $(row),
                    $cols = $row.find('td');

                return $cols.map(function (j, col) {
                    var $col = $(col);
                    var text;
                    if ($($(col)).find("input:checkbox").length > 0)
                        text = $($(col)).find("input:checkbox").prop('checked') ? 'Yes' : 'No';
                    else
                        text = $col.text();

                    if (text === "") {
                        text = "";
                    }

                    return text.replace('"', '""');

                }).get().join(tmpColDelim);

            }).get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim) + '"';
        dumpd += csv + "\n\n";
        dumpd = dumpd.replace(/""\r\n/, '')
    })
    var csvData = new Blob(["\uFEFF" + dumpd], {
        type: 'text/csv;charset=utf-8;'
    });
    var csvUrl = URL.createObjectURL(csvData);
    return csvUrl
}