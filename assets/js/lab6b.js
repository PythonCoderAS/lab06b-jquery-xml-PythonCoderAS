function dateText(dateString) {
    return dateString + " (" + Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24)) + " days ago)"
}

$(document).ready(function (){
    console.log(1)
    $.ajax("./data/feed.rss.xml", {
        dataType: "xml",
        success: function (data) {
            console.log(2)
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
                // Take the difference between two dates and converts the result from milliseconds to days
                newText += '<p class="rss-item-date">Written on ' + dateText(pubDate) + "</p>"
                newText += '<p class="rss-item-description">' + description + "</p>"
                newText += "</div>"
            })
            newText += '</div><p class="rss-feed-date">Feed last built on ' + dateText(lastBuildDate) + " and last published on " + dateText(publishDate) + "</p>"
            outputArea.innerHTML = newText
        }
    })
})