import React from 'react';

export default function Testimonials({ testimonials }) {
  return (
    <div className="testimonials-grid" id="testimonialsGrid">
      {testimonials.map((testimonial, index) => (
        <div className="testimonial-card" key={index}>
          <div className="testimonial-rating">
            {'★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating)}
          </div>
          <p className="testimonial-text">"{testimonial.text}"</p>
          <p className="testimonial-author">- {testimonial.name}</p>
        </div>
      ))}
    </div>
  );
}
