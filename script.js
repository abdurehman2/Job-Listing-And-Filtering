$(document).ready(function () {
  let jobListings = [];
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
        return $(this).text().slice(0, -1);
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
    $(this).closest(".selected-tag").remove();
    filterJobListings();
  });

  $(".tags").on("click", function () {
    const clickedTag = $(this).text();

    if (!$(".selected-tag:contains(" + clickedTag + ")").length) {
      const selectedTag = $(`
      <div class="filter-tags">
      </div>
      `)
        .text(clickedTag)
        .addClass("selected-tag tags");

      $(".filter").append(selectedTag);
      const filterDelete = $(`<button class="filter-btn"></button>`)
        .text("x")
        .addClass("filter-btn");
      $(".selected-tag").append(filterDelete);
    }

    filterJobListings();
  });

  $(".clear-btn").on("click", function () {
    $(".selected-tag").remove();
    $(".job-listing").show();
  });

  const openJobDetailsPopup = (description) => {
    $("#popup-overlay").show();
    $("#job-details-description").text(description);
  };

  $(".job-listing").on("click", function (event) {
    if (
      !$(event.target).hasClass("tags") &&
      !$(event.target).hasClass("delete-btn")
    ) {
      const description = $(this).find(".description p").text();
      openJobDetailsPopup(description);
    }
  });

  $(".job-listing button, .job-listing .tags").on("click", function (event) {
    event.stopPropagation();
  });

  // delete the job listing from array.
  $(".job-listing button, .job-listing .delete-btn").on(
    "click",
    function (event) {
      $(this).closest(".job-listing").remove();
    }
  );

  // close the popup when clicking the close button
  $("#popup-close-button").on("click", function () {
    $("#popup-overlay").hide();
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

    const companyName = $("#company-name").val();
    const role = $("#position").val();
    const location = $("#location").val();
    const tags = $("#tags").val().split(",");
    const description = $("#description").val();

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
          <div class="description" style="display: none">
              <p>
                ${description}
              </p>
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

    $(".job-listing").first().before(newJobListing);

    $("#popup-overlay").hide();

    $("#company-name, #position, #location").val("");

    newJobListing.on("click", ".delete-btn", function () {
      removeJobListing(newJobListing);
    });

    newJobListing.on("click", function () {
      const description = $(this).find(".description p").text();
      openJobDetailsPopup(description);
    });

    newJobListing.on("click", function (event) {
      $(this).closest(".job-listing").remove();
    });
  });
});
