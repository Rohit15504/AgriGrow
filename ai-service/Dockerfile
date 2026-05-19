# Use an official Python runtime
FROM python:3.10

# Hugging Face requires apps to run as user 1000 for security
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Install dependencies first
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all your AI service files (app.py, models, etc.)
COPY --chown=user . .

# Expose the required port
EXPOSE 7860

# Command to run the Flask app
CMD ["python", "app.py"]