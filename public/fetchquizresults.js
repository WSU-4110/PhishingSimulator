fetch('/api/quiz-results', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    employee_id: 1,
    company_id: 1,
    module_number: 1,
    score: '4/4'
  })
})
.then(res => res.text())
.then(data => alert("Server says: " + data));
// app.use(express.static('public')); put in a <script> in html? or use fetch
