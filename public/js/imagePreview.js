document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) document.getElementById('imagePreview').src = URL.createObjectURL(file);
  });