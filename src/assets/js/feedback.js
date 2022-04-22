var GetRating = undefined;

class FeedBack {
	constructor(e) {
		const FeedBackForm = new FormData(e.target);

		if (GetRating != undefined) {
			FeedBackForm.append("rating", GetRating);
			$.ajax({
				type: "POST",
				url: "https://allinformationinoneplace.000webhostapp.com/feedback/index.php",
				data: FeedBackForm,
				processData: false,
				contentType: false,
				beforeSend: function() {
					document.getElementById("loadingBtn").disabled = true;
					document.getElementById("loadingIcon").classList.remove("d-none");
				},
				success: function(response) {
					// console.log(response);
					var json = response;
					if (json.success) {
						var requestOptions = {
							method: "POST",
							body: FeedBackForm,
							redirect: "follow",
						};
						fetch(
								"https://allinformationinoneplace.000webhostapp.com/feedback/mailToDeveloper.php",
								requestOptions
							)
							.then((response) => response.text())
							.then((result) => {
                                // console.log(result)
								return null;
							})
							.catch((error) => {
								return null;
							});

						document.getElementById("response").innerHTML =
							"Thanks For Your Feedback !";
					}
					document.getElementById("loadingBtn").disabled = false;
					document.getElementById("loadingIcon").classList.add("d-none");
					document.getElementById("modalClose").click();
					document.getElementById("feedbackForm").reset();
				},
				error: function(error) {
					var json = JSON.parse(error);
					document.getElementById("response").innerHTML =
						"Opps ! Your Feedback is not sent !";
					document.getElementById("loadingBtn").disabled = false;
					document.getElementById("loadingIcon").classList.add("d-none");
					document.getElementById("modalClose").click();
				},
			});
		} else {
			var Message = document.getElementById("feedbackmessage");
			Message.innerHTML = "Please Select One Of Rating Button..";
			Message.classList.add("text-danger");
		}
	}
}

document.getElementById("feedbackForm").onsubmit = function(e) {
	e.preventDefault();
	new FeedBack(e);
};

class Rating {
	constructor() {
		var RatingButton = document.getElementsByClassName("ratingBtn");
		for (var i = 0; i < RatingButton.length; i++) {
			RatingButton[i].onclick = function() {
				if (this.classList.contains("good")) {
					this.classList.add("activeGoodRatingButton");
					document
						.getElementById("badBtn")
						.classList.remove("activeBadRatingButton");
					GetRating = "5 Star";
					document.getElementsByName(
						"message"
					)[0].value = `It's Awesome, Helo Postmaster your application is working realy fine so i gave you 5 star. Your team is doing such a great job. Keep it up`;
				} else {
					if (this.classList.contains("bad")) {
						this.classList.add("activeBadRatingButton");
						document
							.getElementById("goodBtn")
							.classList.remove("activeGoodRatingButton");
						GetRating = "Bad";
						document.getElementsByName("message")[0].value = "";
					}
				}
			};
		}
	}
}

new Rating();