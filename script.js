$(document).ready(function () {
  let jobListings = [];
  // Fetch data.json using jQuery AJAX
  $.getJSON("./data.json", function (data) {
    jobListings = data;
    console.log(jobListings);
  }).fail(function (error) {
    console.error("Error fetching JSON data:", error);
  });

  function filterJobListings() {
    // Get all selected tags
    const selectedTags = $(".selected-tag")
      .map(function () {
        return $(this).text().slice(0, -1); // Exclude the "x" button
      })
      .get();

    // If no tags are selected, show all job listings
    if (selectedTags.length === 0) {
      $(".job-listing").show();
      return;
    }

    // Loop through all job listings
    $(".job-listing").each(function () {
      const jobListingTags = $(this)
        .find(".tags")
        .map(function () {
          return $(this).text();
        })
        .get();

      const includesAllTags = selectedTags.every((tag) =>
        jobListingTags.includes(tag)
      );
      $(this).toggle(includesAllTags);
    });
  }

  $(".filter").on("click", ".filter-btn", function () {
    $(this).closest(".selected-tag").remove(); // Remove the associated filter tag
    // Filter job listings based on selected tags

    filterJobListings();
  });

  $(".tags").on("click", function () {
    const clickedTag = $(this).text(); // Get the text content of the clicked tag

    // Check if the tag already exists in the "filter" div
    if (!$(".selected-tag:contains(" + clickedTag + ")").length) {
      const selectedTag = $(`
      <div class="filter-tags">
      </div>
      `)
        .text(clickedTag)
        .addClass("selected-tag tags");

      $(".filter").append(selectedTag); // Append the selected tag to the "filter" div
      const filterDelete = $(`<button class="filter-btn"></button>`)
        .text("x")
        .addClass("filter-btn");
      $(".selected-tag").append(filterDelete);
    }

    filterJobListings(); // Filter job listings based on selected tags
  });

  //Add a click event listener to the "Clear" button
  $(".clear-btn").on("click", function () {
    $(".selected-tag").remove(); // Remove all selected tags from the "filter" div
    $(".job-listing").show();
  });

  // Function to handle the click event on the "Delete" button
  $(".job-listing").on("click", ".delete-btn", function () {
    $(this).closest(".job-listing").remove(); // Remove the parent .job-listing div
  });

  $(".add-job-btn").on("click", function () {
    $("#popup-form").show(); // Show the popup form
    console.log("Form opened");
  });

  $("#close-btn").on("click", function () {
    $("#popup-form").hide(); // Hide the popup form
  });

  const removeJobListing = (jobListing) => {
    $(jobListing).remove();
  };

  $("#job-form").submit(function (event) {
    event.preventDefault();

    // Get form input values
    const companyName = $("#company-name").val();
    const role = $("#position").val();
    const location = $("#location").val();
    const tags = $("#tags").val().split(",");

    // Create a new job listing HTML element
    const newJobListing = $(`
    <div class="job-listing">
      <button class="delete-btn">X</button>
      <span class="listing-information">
        <!-- Replace with your actual company logo -->
        <img src="images/the-air-filter-company.svg" alt="${companyName}-Logo" class="company-img">
        <div class="job-info">
          <div class="company-info">
            <p class="company-name">${companyName}</p>
          </div>
          <div class="position">
            <span class="role">${role}</span>
          </div>
          <div class="location">
            <ul class="jobs__details">
              <!-- Replace with actual job details -->
              <li class="jobs__details-item">a few seconds ago</li>
              <li class="jobs__details-item">${location}</li>
            </ul>
          </div>
        </div>
      </span>
      <span class="tags-div">
        <!-- Tags go here -->
      </span>
    </div>`);

    tags.forEach(function (tag) {
      newJobListing
        .find(".tags-div")
        .append(`<p class="tags">${tag.trim()}</p>`);
    });

    // Prepend the new job listing to the top of the job listings
    $(".job-listing").first().before(newJobListing);

    // Close the popup
    $("#popup-overlay").hide();

    // Reset form fields
    $("#company-name, #position, #location").val("");

    // Attach a click event handler to the "X" button of the new job listing
    newJobListing.on("click", ".delete-btn", function () {
      removeJobListing(newJobListing);
    });
  });
});
