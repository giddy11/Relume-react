import React from 'react'
import './Homepage.css';
import career from "../../assets/homepage/carrrr.jpg";
import doctor from "../../assets/homepage/doctrbg.jpg";
import bg_2 from "../../assets/homepage/firsthomepagebg.jpg";
import person from "../../assets/homepage/person_1.jpeg";
import lifestyle from "../../assets/homepage/lifestyleimage.jpeg";
import getstarted from "../../assets/homepage/getstarted.jpg";

const Homepage = () => {
  return (
    <>
      <div>
        <div className="backgroundImage pt-6">
          <div class="backgroundImage_writeup">
            <div>
              <div>
                <p class="bg1-fontstyle1">Welcome to HelpMate</p>
                <p class="bg1-fontstyle2">We believe in the power of compassion personalized <br />care to
                  help you acheive medical & emotional <br />wellbeing and enjoy a healthy lifestyle</p>
              </div> <br />
              <button class="bg-fontstyle3">Explore our services</button>
            </div>
          </div>
        </div>

        <div className="background_color">
          <div class="div-text">
            <span className="what-we-do">What we do for you</span>
            <span className="underline"></span>
          </div>
          <div className="background_arrange">
            <div className="div-text ">
              <p className="bg1-fontstyle2 text-bg">We offer professional services in the areas of medical, pychology and
                career mentorship. We want to help you overcome challenges that you are passing through alone.
                We are that friend you can anonymously count on to help you through difficult times, and our
                services are completely confidential.</p> <br />
            </div>
            <div>
              <img src={bg_2} alt='' className="image-background" />
            </div>
          </div>
        </div>
        <div className>
          <div class="div-text">
            <span class="what-we-do">Our Departments</span>
            <span class="underline"></span>
            <br />
          </div>

          <div>
            <div className="bg-what-we-do">
              <div>
                <img src={career} alt="" class="department1-image" />
              </div>
              <div>
                <img src={lifestyle} alt="" class="department1-image" />
              </div>
              <div>
                <img src={doctor} alt="" class="department1-image" />
              </div>
            </div>

          </div>
          <div>
            <div class="department1-text">
              <div>
                <span class="department1-text1">Career Mentorship</span> <br></br>
                <span class="department1-text2">
                  {" "}
                  We emphasize preventive care to maintain your
                  <br />
                  health and provide convenient, accessible services with flexible
                  hours. <br/> <br/> <button class="bg-fontstyle3">Learn more</button>
                </span>
              </div>
              <div>
                <span class="department1-text1">Psychology</span> <br></br>
                <span class="department1-text2">
                  We focus on preventive care, health education, and personalized
                  support to promote the well-being of mothers and their children.
                  <br/> <br/> <button class="bg-fontstyle3">Learn more</button>
                </span>
              </div>
              <div>
                <span class="department1-text1">Medical</span> <br></br>
                <span class="department1-text2">
                  We provide preventive care and personalized plans, supporting
                  women's health through every stage of life with compassionate
                  care. <br/> <br/> <button class="bg-fontstyle3">Learn more</button>
                </span>
              </div>
            </div>

          </div>

          <div>
            <div class="bg-3 bg-4-display">
              <div>
                <img src={getstarted} alt="" className="get-started-img" />
              </div>
              <div className="bg-4">
                <div class="div-text2">
                  <span className="what-we-do">Get started in four simple steps!</span>
                  <span className="underline"></span>
                </div>
                <div className="div-text-3">
                  <p><span className="number-circle">1</span><span class="bg-fontstyle2">Select the department most
                    suitaable for your need</span> </p> <br />
                  <p><span className="number-circle">2</span><span class="bg-fontstyle2">Choose your desired service
                    provider</span> </p> <br />
                  <p><span className="number-circle">3</span><span class="bg-fontstyle2">Make payment</span></p> <br />
                  <p><span class="number-circle">4</span><span class="bg-fontstyle2">Enjoy your one-on-one
                    conversation from
                    your home</span></p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div>
        <div class="bg-5">
                <div class="div-text">
                    <span class="what-we-do">What people say about us</span>
                    <span class="underline"></span>

                </div>
                <div className="bg-5-child">
                    <img src={person} alt="" class="bg-5-image"/>
                    <p class="bg-fontstyle2">I was able to finally open up to
                        someone about some <br/>very sensitive information about my body, <br/>and now I am getting all
                        the
                        help I need <br/>and I am happier than ever</p>
                    <p class="star-icon"> <i class="fa fa-star"></i><i class="fa fa-star"></i><i
                            class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></p>
                    <p class="bg-fontstyle2">CLIFFORD FRAIZER - Medical department</p>
                </div>

            </div>
        </div>


      </div >

      
    </>
  )
}

export default Homepage