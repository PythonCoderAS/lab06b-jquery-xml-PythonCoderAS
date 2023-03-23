function dateText(dateString) {
    return dateString + " (" + Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24)) + " days ago)"
}

$(document).ready(function (){
    $.ajax("./data/feed.rss.xml", {
        dataType: "xml",
        success: function (data) {
            const jqD = $(data)
            const description = jqD.find("description").first().text()
            const feedTitle = jqD.find("title").first().text()
            const feedLink = jqD.find("link").first().text()
            const lastBuildDate = jqD.find("lastBuildDate").first().text()
            const publishDate = jqD.find("pubDate").first().text()
            const outputArea = document.querySelector("#rss-data-body")
            let newText;
            newText = '<h2><a href="' + feedLink + '">' + feedTitle + "</a></h2>"
            newText += "<p>" + description + "</p>" + '<div id="rss-items" class="items">'
            const items = jqD.find("item")
            items.each(function (index, item) {
                newText += '<div class="rss-item">'
                const jqItem = $(item)
                const title = jqItem.find("title").text()
                const link = jqItem.find("link").text()
                newText += '<h3><a href="' + link + '">' + title + "</a></h3>"
                const description = jqItem.find("description").text()
                const pubDate = jqItem.find("pubDate").text()
                const itemGuid = jqItem.find("guid").text()
                // Take the difference between two dates and converts the result from milliseconds to days
                newText += '<p class="rss-item-subtitle"><span>Written on ' + dateText(pubDate) + "</span><span>" + '<a class="rss-item-guid" href="' + itemGuid + '"' + ">Item GUID</a></span></p>"
                newText += '<p class="rss-item-description">' + description + "</p>"
                newText += "</div>"
            })
            newText += '</div><p class="rss-feed-date">Feed last built on ' + dateText(lastBuildDate) + " and last published on " + dateText(publishDate) + "</p>"
            outputArea.innerHTML = newText
        }
    })
    $.ajax("./data/feed.atom.xml", {
        dataType: "xml",
        success: function (data) {
            const jqD = $(data)
            const description = jqD.find("subtitle").first().text()
            const feedTitle = jqD.find("title").first().text()
            const feedLink = jqD.find("link:not([rel=self])").first().attr("href")
            const feedGuid = jqD.find("id").first().text()
            const lastBuildDate = jqD.find("updated").first().text()
            const outputArea = document.querySelector("#atom-data-body")
            let newText;
            newText = '<h2><a href="' + feedLink + '">' + feedTitle + "</a></h2>"
            newText += "<p>" + description + "</p>" + '<div id="atom-items" class="items">'
            const items = jqD.find("entry")
            items.each(function (index, item) {
                newText += '<div class="atom-item">'
                const jqItem = $(item)
                const title = jqItem.find("title").text()
                const link = jqItem.find("link").attr("href")
                newText += '<h3><a href="' + link + '">' + title + "</a></h3>"
                const description = jqItem.find("summary").text()
                const pubDate = jqItem.find("updated").text()
                const itemGuid = jqItem.find("id").text()
                // Take the difference between two dates and converts the result from milliseconds to days
                newText += '<p class="atom-item-subtitle"><span>Written on ' + dateText(pubDate) + "</span>" + '<span class="atom-item-guid">Item GUID: ' + itemGuid + "</span></p>"
                newText += '<p class="atom-item-description">' + description + "</p>"
                newText += "</div>"
            })
            newText += '</div><p class="atom-feed-date">Feed last published on ' + dateText(lastBuildDate) + ". Feed GUID: " + feedGuid + "</p>"
            outputArea.innerHTML = newText
        }
    })
})