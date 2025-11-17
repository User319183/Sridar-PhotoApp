let mCurrentIndex = 0; // Tracks the current image index
let mImages = []; // Array to hold GalleryImage objects
const mUrl = "images.json"; // Replace with actual JSON URL
const mWaitTime = 5000; // Timer interval in milliseconds

$(document).ready(() => {
	$(".details").hide(); // Hide details initially

	// Select the moreIndicator button and add a click event to:
	// - toggle the rotation classes (rot90 and rot270)
	// - slideToggle the visibility of the .details section
	$(".moreIndicator").click(function () {
		$(".details").slideToggle(300);
		// Toggle between rot90 and rot270 to visually rotate the indicator
		$(this).toggleClass("rot90 rot270");
		// Update aria-expanded for accessibility
		const expanded = $(".details").is(":visible");
		$(this).attr("aria-expanded", expanded);
	});

	// Select the "Next Photo" button and add a click event to call showNextPhoto
	$("#nextPhoto").click(showNextPhoto);

	// Select the "Previous Photo" button and add a click event to call showPrevPhoto
	$("#prevPhoto").click(showPrevPhoto);

	// Call fetchJSON() to load the initial set of images
	fetchJSON();
});

// Function to fetch JSON data and store it in mImages
let mTimerId = null;

function fetchJSON() {
	$.ajax({
		url: mUrl,
		type: "GET",
		dataType: "json",
		success: function (data) {
			// Parse the JSON and push each image object into mImages array
			data.images.forEach(function (image) {
				mImages.push(image);
			});
			// After JSON is loaded, call swapPhoto() to display the first image
			swapPhoto();
			// Start timer after images have successfully loaded
			startTimer();
		},
		error: function (xhr, status, error) {
			console.error("Error loading JSON:", error);
		},
	});
}

// Function to swap and display the next photo in the slideshow
function swapPhoto() {
	// Access mImages[mCurrentIndex] to update the image source and details
	const currentImage = mImages[mCurrentIndex];

	// Update the #photo element's src attribute with the current image's path
	$("#photo").attr("src", currentImage.imgPath);
	// Set alt text to description for accessibility
	$("#photo").attr("alt", currentImage.description);

	// Update the .location, .description, and .date elements with the current image's details
	$(".location").text("Location: " + currentImage.imgLocation);
	$(".description").text("Description: " + currentImage.description);
	$(".date").text("Date: " + currentImage.date);
}

// Advances to the next photo, loops to the first photo if the end of array is reached
function showNextPhoto() {
	// Increment mCurrentIndex and call swapPhoto()
	mCurrentIndex++;
	// Ensure it loops back to the beginning if mCurrentIndex exceeds array length
	if (mCurrentIndex >= mImages.length) {
		mCurrentIndex = 0;
	}
	if (mImages.length > 0) {
		swapPhoto();
	}
}

// Goes to the previous photo, loops to the last photo if mCurrentIndex goes negative
function showPrevPhoto() {
	// Decrement mCurrentIndex and call swapPhoto()
	mCurrentIndex--;
	// Ensure it loops to the end if mCurrentIndex is less than 0
	if (mCurrentIndex < 0) {
		mCurrentIndex = mImages.length - 1;
	}
	if (mImages.length > 0) {
		swapPhoto();
	}
}

// Starter code for the timer function
function startTimer() {
	if (mTimerId) {
		clearInterval(mTimerId);
	}
	// Create a timer to automatically call `showNextPhoto()` every mWaitTime milliseconds
	mTimerId = setInterval(showNextPhoto, mWaitTime);
}
