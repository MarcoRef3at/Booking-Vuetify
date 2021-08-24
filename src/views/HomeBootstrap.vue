<template>
  <div class="hello">
    <!-- ======= Hero Section ======= -->
    <section id="hero">
      <div class="hero-container">
        <h1>Padel like never before!</h1>
        <h2>Book your padel court instantly</h2>
        <section id="cta" class="booknow">
          <a class="cta-btn" @click="$router.push('/courts')">Book Now</a>
        </section>
      </div>
    </section>
    <!-- End Hero -->

    <main id="main">
      <!-- ======= About Section ======= -->
      <section id="about" class="about">
        <div class="container">
          <div class="row no-gutters">
            <div class="content col-xl-5 d-flex align-items-stretch">
              <div class="content">
                <h3>Welcome to EL GOUNA PADEL ASSOCIATION</h3>
                <p>
                  Anyone playing padel in Egypt right now is a pioneer of what
                  greatness will come for this fabulous sport. The GOUNA PADEL
                  welcomes new facilities and investors to come to El Gouna and
                  to be part of the success of padel in Egypt.
                </p>
                <a @click="$router.push('/courts')" class="about-btn"
                  >Book Now <i class="bx bx-chevron-right"></i
                ></a>
              </div>
            </div>
            <div class="col-xl-7 d-flex align-items-stretch">
              <div class="icon-boxes d-flex flex-column justify-content-center">
                <div class="row">
                  <div class="col-md-6 icon-box" data-aos-delay="100">
                    <i class="bx bx-receipt"></i>
                    <h4>We Are Always Available</h4>
                    <p>
                      Our courts are available for booking everyday from 4pm to
                      12am
                    </p>
                  </div>
                  <div class="col-md-6 icon-box" data-aos-delay="200">
                    <i class="bx bx-cube-alt"></i>
                    <h4>Bring your friends</h4>
                    <p>
                      Our courts have stands for your family and friend to have
                      a seat watching the game.
                    </p>
                  </div>
                  <!-- <div
                    class="col-md-6 icon-box"
                    
                    data-aos-delay="300"
                  >
                    <i class="bx bx-images"></i>
                    <h4>Labore consequatur</h4>
                    <p>
                      Aut suscipit aut cum nemo deleniti aut omnis. Doloribus ut
                      maiores omnis facere
                    </p>
                  </div>
                  <div
                    class="col-md-6 icon-box"
                    
                    data-aos-delay="400"
                  >
                    <i class="bx bx-shield"></i>
                    <h4>Beatae veritatis</h4>
                    <p>
                      Expedita veritatis consequuntur nihil tempore laudantium
                      vitae denat pacta
                    </p>
                  </div> -->
                </div>
              </div>
              <!-- End .content-->
            </div>
          </div>
        </div>
      </section>
      <!-- End About Section -->

      <!-- ======= Services Section ======= -->
      <section id="services" class="services">
        <div class="container">
          <div class="section-title" data-aos-delay="100">
            <h2>All that you need to know about padel in El Gouna</h2>
          </div>
        </div>
      </section>
      <!-- End Services Section -->

      <!-- ======= Cta Section ======= -->
      <section id="cta" class="cta">
        <div class="container">
          <div class="text-center">
            <h3>Reserve Your Court</h3>

            <a class="cta-btn" @click="$router.push('/courts')">Book Now</a>
          </div>
        </div>
      </section>
      <!-- End Cta Section -->

      <!-- ======= Portfolio Section ======= -->
      <section id="portfolio" class="portfolio">
        <div class="container">
          <div class="section-title" data-aos-delay="100">
            <h2>Events</h2>
            <p>
              One of the most exciting events took place from the 11th till the
              13th of March as El Gouna collaborated with I-Events, El Gouna
              Padel & PadelPod Egypt for an outstanding tournament. It was the
              first ever to be held at El Gouna & we cannot wait for the next
              Tournament.
            </p>
          </div>

          <div class="row">
            <div class="col-lg-12 d-flex justify-content-center">
              <ul id="portfolio-flters">
                <li data-filter="*" class="filter-active">All</li>
                <li data-filter=".filter-app">Upcoming</li>
                <li data-filter=".filter-card">Previous</li>
                <li data-filter=".filter-web">Special</li>
              </ul>
            </div>
          </div>

          <div class="row portfolio-container">
            <div class="col-lg-4 col-md-6 portfolio-item filter-app">
              <div class="portfolio-wrap">
                <img
                  src="assets/img/portfolio/portfolio-1.jpg"
                  class="img-fluid"
                  alt=""
                />
                <div class="portfolio-links">
                  <a
                    href="assets/img/portfolio/portfolio-1.jpg"
                    data-gallery="portfolioGallery"
                    class="portfolio-lightbox"
                    title="App 1"
                    ><i class="bx bx-plus"></i
                  ></a>
                  <a href="portfolio-details.html" title="More Details"
                    ><i class="bx bx-link"></i
                  ></a>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 portfolio-item filter-web">
              <div class="portfolio-wrap">
                <img
                  src="assets/img/portfolio/portfolio-2.jpg"
                  class="img-fluid"
                  alt=""
                />
                <div class="portfolio-links">
                  <a
                    href="assets/img/portfolio/portfolio-2.jpg"
                    data-gallery="portfolioGallery"
                    class="portfolio-lightbox"
                    title="Web 3"
                    ><i class="bx bx-plus"></i
                  ></a>
                  <a href="portfolio-details.html" title="More Details"
                    ><i class="bx bx-link"></i
                  ></a>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 portfolio-item filter-app">
              <div class="portfolio-wrap">
                <img
                  src="assets/img/portfolio/portfolio-3.jpg"
                  class="img-fluid"
                  alt=""
                />
                <div class="portfolio-links">
                  <a
                    href="assets/img/portfolio/portfolio-3.jpg"
                    data-gallery="portfolioGallery"
                    class="portfolio-lightbox"
                    title="App 2"
                    ><i class="bx bx-plus"></i
                  ></a>
                  <a href="portfolio-details.html" title="More Details"
                    ><i class="bx bx-link"></i
                  ></a>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 portfolio-item filter-card">
              <div class="portfolio-wrap">
                <img
                  src="assets/img/portfolio/portfolio-4.jpg"
                  class="img-fluid"
                  alt=""
                />
                <div class="portfolio-links">
                  <a
                    href="assets/img/portfolio/portfolio-4.jpg"
                    data-gallery="portfolioGallery"
                    class="portfolio-lightbox"
                    title="Card 2"
                    ><i class="bx bx-plus"></i
                  ></a>
                  <a href="portfolio-details.html" title="More Details"
                    ><i class="bx bx-link"></i
                  ></a>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 portfolio-item filter-web">
              <div class="portfolio-wrap">
                <img
                  src="assets/img/portfolio/portfolio-5.jpg"
                  class="img-fluid"
                  alt=""
                />
                <div class="portfolio-links">
                  <a
                    href="assets/img/portfolio/portfolio-5.jpg"
                    data-gallery="portfolioGallery"
                    class="portfolio-lightbox"
                    title="Web 2"
                    ><i class="bx bx-plus"></i
                  ></a>
                  <a href="portfolio-details.html" title="More Details"
                    ><i class="bx bx-link"></i
                  ></a>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 portfolio-item filter-app">
              <div class="portfolio-wrap">
                <img
                  src="assets/img/portfolio/portfolio-6.jpg"
                  class="img-fluid"
                  alt=""
                />
                <div class="portfolio-links">
                  <a
                    href="assets/img/portfolio/portfolio-6.jpg"
                    data-gallery="portfolioGallery"
                    class="portfolio-lightbox"
                    title="App 3"
                    ><i class="bx bx-plus"></i
                  ></a>
                  <a href="portfolio-details.html" title="More Details"
                    ><i class="bx bx-link"></i
                  ></a>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 portfolio-item filter-card">
              <div class="portfolio-wrap">
                <img
                  src="assets/img/portfolio/portfolio-7.jpg"
                  class="img-fluid"
                  alt=""
                />
                <div class="portfolio-links">
                  <a
                    href="assets/img/portfolio/portfolio-7.jpg"
                    data-gallery="portfolioGallery"
                    class="portfolio-lightbox"
                    title="Card 1"
                    ><i class="bx bx-plus"></i
                  ></a>
                  <a href="portfolio-details.html" title="More Details"
                    ><i class="bx bx-link"></i
                  ></a>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 portfolio-item filter-card">
              <div class="portfolio-wrap">
                <img
                  src="assets/img/portfolio/portfolio-8.jpg"
                  class="img-fluid"
                  alt=""
                />
                <div class="portfolio-links">
                  <a
                    href="assets/img/portfolio/portfolio-8.jpg"
                    data-gallery="portfolioGallery"
                    class="portfolio-lightbox"
                    title="Card 3"
                    ><i class="bx bx-plus"></i
                  ></a>
                  <a href="portfolio-details.html" title="More Details"
                    ><i class="bx bx-link"></i
                  ></a>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 portfolio-item filter-web">
              <div class="portfolio-wrap">
                <img
                  src="assets/img/portfolio/portfolio-9.jpg"
                  class="img-fluid"
                  alt=""
                />
                <div class="portfolio-links">
                  <a
                    href="assets/img/portfolio/portfolio-9.jpg"
                    data-gallery="portfolioGallery"
                    class="portfolio-lightbox"
                    title="Web 3"
                    ><i class="bx bx-plus"></i
                  ></a>
                  <a href="portfolio-details.html" title="More Details"
                    ><i class="bx bx-link"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- End Portfolio Section -->

      <!-- ======= Testimonials Section ======= -->
      <section id="testimonials" class="testimonials section-bg">
        <div class="container">
          <div class="section-title" data-aos-delay="100">
            <h2>Come play padel with us and enjoy</h2>
          </div>
        </div>
      </section>
      <!-- End Testimonials Section -->

      <!-- ======= Team Section ======= -->
      <section id="team" class="team">
        <div class="container">
          <div class="section-title" data-aos-delay="100">
            <h2>Our Professional Coaches</h2>
          </div>

          <div class="row">
            <div class="col-lg-4 col-md-6">
              <div class="member">
                <div class="pic">
                  <img
                    src="assets/img/team/team-1.jpg"
                    class="img-fluid"
                    alt=""
                  />
                </div>
                <div class="member-info">
                  <h4>Walter White</h4>
                  <div class="social">
                    <a href=""><i class="bi bi-twitter"></i></a>
                    <a href=""><i class="bi bi-facebook"></i></a>
                    <a href=""><i class="bi bi-instagram"></i></a>
                    <a href=""><i class="bi bi-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6">
              <div class="member" data-aos-delay="150">
                <div class="pic">
                  <img
                    src="assets/img/team/team-2.jpg"
                    class="img-fluid"
                    alt=""
                  />
                </div>
                <div class="member-info">
                  <h4>John Jhonson</h4>
                  <div class="social">
                    <a href=""><i class="bi bi-twitter"></i></a>
                    <a href=""><i class="bi bi-facebook"></i></a>
                    <a href=""><i class="bi bi-instagram"></i></a>
                    <a href=""><i class="bi bi-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6">
              <div class="member" data-aos-delay="300">
                <div class="pic">
                  <img
                    src="assets/img/team/team-3.jpg"
                    class="img-fluid"
                    alt=""
                  />
                </div>
                <div class="member-info">
                  <h4>William Anderson</h4>
                  <div class="social">
                    <a href=""><i class="bi bi-twitter"></i></a>
                    <a href=""><i class="bi bi-facebook"></i></a>
                    <a href=""><i class="bi bi-instagram"></i></a>
                    <a href=""><i class="bi bi-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- End Team Section -->

      <!-- ======= Contact Section ======= -->
      <section id="contact" class="contact section-bg">
        <div class="container">
          <div class="section-title">
            <h2>Contact</h2>
          </div>

          <div class="row">
            <div class="col-lg-6">
              <div class="info-box mb-4">
                <i class="bx bx-map"></i>
                <h3>Our Address</h3>
                <p>Downtown,El Gouna ,Second Hurghada, Red Sea Governorate</p>
              </div>
            </div>

            <div class="col-lg-3 col-md-6">
              <div class="info-box mb-4">
                <i class="bx bx-envelope"></i>
                <h3>Email Us</h3>
                <p>padel@elgouna.com</p>
              </div>
            </div>

            <div class="col-lg-3 col-md-6">
              <div class="info-box mb-4">
                <i class="bx bx-phone-call"></i>
                <h3>Call Us</h3>
                <p>0123456789</p>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-6">
              <iframe
                class="mb-4 mb-lg-0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d885.563003332262!2d33.67042582915635!3d27.399066189596244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDIzJzU2LjYiTiAzM8KwNDAnMTUuNSJF!5e0!3m2!1sen!2seg!4v1626086534569!5m2!1sen!2seg"
                frameborder="0"
                style="border: 0; width: 100%; height: 384px"
                allowfullscreen
              ></iframe>
            </div>

            <div class="col-lg-6">
              <form
                action="forms/contact.php"
                method="post"
                role="form"
                class="php-email-form"
              >
                <div class="row">
                  <div class="col-md-6 form-group">
                    <input
                      type="text"
                      name="name"
                      class="form-control"
                      id="name"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div class="col-md-6 form-group mt-3 mt-md-0">
                    <input
                      type="email"
                      class="form-control"
                      name="email"
                      id="email"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                </div>
                <div class="form-group mt-3">
                  <input
                    type="text"
                    class="form-control"
                    name="subject"
                    id="subject"
                    placeholder="Subject"
                    required
                  />
                </div>
                <div class="form-group mt-3">
                  <textarea
                    class="form-control"
                    name="message"
                    rows="5"
                    placeholder="Message"
                    required
                  ></textarea>
                </div>
                <div class="my-3">
                  <div class="loading">Loading</div>
                  <div class="error-message"></div>
                  <div class="sent-message">
                    Your message has been sent. Thank you!
                  </div>
                </div>
                <div class="text-center">
                  <button type="submit">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <!-- End Contact Section -->
    </main>
    <!-- End #main -->
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      logoUrl: require("../../public/assets/img/padel-logo.png")
    };
  },
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
