import React, { useState, useEffect } from "react";
import "./Borough.css";
import $ from "jquery";
import PageNavbar from "../components/PageNavbar";
import SummaryCard from "../components/SummaryCard";
import { getBoroughSummary } from "../api/ApiCalls";

const jQuerycode = () => {
  $(document).ready(function () {
    var curPage = 1;
    var numOfPages = $(".skw_page").length;
    var animTime = 1000;
    var scrolling = false;
    var pgPrefix = ".skw_page_";

    function pagination() {
      scrolling = true;

      $(pgPrefix + curPage)
        .removeClass("inactive")
        .addClass("active");
      $(pgPrefix + (curPage - 1)).addClass("inactive");
      $(pgPrefix + (curPage + 1)).removeClass("active");

      setTimeout(function () {
        scrolling = false;
      }, animTime);
    }

    function navigateUp() {
      if (curPage === 1) return;
      curPage--;
      pagination();
    }

    function navigateDown() {
      if (curPage === numOfPages) return;
      curPage++;
      pagination();
    }

    $(document).on("mousewheel DOMMouseScroll", function (e) {
      if (scrolling) return;
      if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
        navigateUp();
      } else {
        navigateDown();
      }
    });

    $(document).on("keydown", function (e) {
      if (scrolling) return;
      if (e.which === 38) {
        navigateUp();
      } else if (e.which === 40) {
        navigateDown();
      }
    });
  });
};

function Borough() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    getBoroughSummary(setSummary);
    jQuerycode();
  }, []);

  // console.log(summary);

  return (
    <div className="borough">
      <PageNavbar />
      <div className="skw_pages">
        <div className="skw_page skw_page_1 active">
          <div className="skw_page__half skw_page__half__left">
            <div className="skw_page__skewed">
              <div className="skw_page__content"></div>
            </div>
          </div>
          <div className="skw_page__half skw_page__half__right">
            <div className="skw_page__skewed">
              <div className="skw_page__content">
                <h2 className="skw_page__heading">MANHATTAN</h2>
                <SummaryCard
                  className="skw_page__description"
                  summary={summary[1]}
                />
                <div className="skw_page__description">SCROLL DOWN</div>
              </div>
            </div>
          </div>
        </div>
        <div className="skw_page skw_page_2">
          <div className="skw_page__half skw_page__half__left">
            <div className="skw_page__skewed">
              <div className="skw_page__content">
                <h2 className="skw_page__heading">BROOKLYN</h2>
                <SummaryCard
                  className="skw_page__description"
                  summary={summary[0]}
                />
              </div>
            </div>
          </div>
          <div className="skw_page__half skw_page__half__right">
            <div className="skw_page__skewed">
              <div className="skw_page__content"></div>
            </div>
          </div>
        </div>
        <div className="skw_page skw_page_3">
          <div className="skw_page__half skw_page__half__left">
            <div className="skw_page__skewed">
              <div className="skw_page__content"></div>
            </div>
          </div>
          <div className="skw_page__half skw_page__half__right">
            <div className="skw_page__skewed">
              <div className="skw_page__content">
                <h2 className="skw_page__heading">QUEENS</h2>
                <SummaryCard
                  className="skw_page__description"
                  summary={summary[2]}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="skw_page skw_page_4">
          <div className="skw_page__half skw_page__half__left">
            <div className="skw_page__skewed">
              <div className="skw_page__content">
                <h2 className="skw_page__heading">BRONX</h2>
                <SummaryCard
                  className="skw_page__description"
                  summary={summary[4]}
                />
              </div>
            </div>
          </div>
          <div className="skw_page__half skw_page__half__right">
            <div className="skw_page__skewed">
              <div className="skw_page__content"></div>
            </div>
          </div>
        </div>
        <div className="skw_page skw_page_5">
          <div className="skw_page__half skw_page__half__left">
            <div className="skw_page__skewed">
              <div className="skw_page__content"></div>
            </div>
          </div>
          <div className="skw_page__half skw_page__half__right">
            <div className="skw_page__skewed">
              <div className="skw_page__content">
                <h2 className="skw_page__heading">STATEN ISLAND</h2>
                <SummaryCard
                  className="skw_page__description"
                  summary={summary[3]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Borough;
