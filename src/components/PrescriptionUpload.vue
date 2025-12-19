<template>
  <section id="prescription" class="prescription-section">
    <div class="container">
      <Transition name="fade-up" appear>
        <div v-if="showHeader" class="header-content">
          <span class="badge">
            <i class="fas fa-upload"></i>
            Easy Upload
          </span>
          <h2 class="section-title">Upload Your Prescription</h2>
          <p class="section-description">
            Simply upload a photo of your prescription and we'll prepare your medicines
          </p>
        </div>
      </Transition>

      <Transition name="fade-up" appear>
        <div v-if="showContainer" class="upload-container">
          <Transition name="scale-fade" mode="out-in">
            <div v-if="!uploaded" key="upload" class="upload-card">
              <!-- Drop Zone -->
              <div
                @dragenter.prevent="handleDrag"
                @dragleave.prevent="handleDrag"
                @dragover.prevent="handleDrag"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
                :class="['drop-zone', { 'drag-active': dragActive }]"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  @change="handleFileChange"
                  class="file-input"
                />

                <div class="drop-zone-content">
                  <div class="icon-wrapper">
                    <i class="fas fa-camera"></i>
                  </div>
                  <div>
                    <p class="drop-zone-title">Drop your prescription here</p>
                    <p class="drop-zone-subtitle">or click to browse (JPG, PNG, PDF)</p>
                  </div>
                </div>
              </div>

              <!-- File List -->
              <div v-if="files.length > 0" class="file-list">
                <div
                  v-for="(file, index) in files"
                  :key="index"
                  class="file-item"
                >
                  <i class="fas fa-file-image file-icon"></i>
                  <span class="file-name">{{ file.name }}</span>
                  <button
                    @click="removeFile(index)"
                    class="remove-btn"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="form-fields">
                <input
                  v-model="phoneNumber"
                  type="tel"
                  placeholder="Your Phone Number"
                  class="form-input"
                />
                <input
                  v-model="deliveryAddress"
                  type="text"
                  placeholder="Delivery Address (Optional)"
                  class="form-input"
                />
              </div>

              <!-- Upload Button -->
              <button
                @click="handleUpload"
                :disabled="uploading"
                class="upload-button"
              >
                <i v-if="!uploading" class="fas fa-upload"></i>
                <span v-if="uploading" class="uploading-text">Uploading...</span>
                <span v-else>Submit Prescription</span>
              </button>
            </div>

            <!-- Success State -->
            <div v-else key="success" class="success-card">
              <div class="success-icon-wrapper">
                <i class="fas fa-check-circle"></i>
              </div>
              <h3 class="success-title">Prescription Uploaded!</h3>
              <p class="success-description">
                Our pharmacist will review your prescription and contact you within 30 minutes.
              </p>
              <button
                @click="resetUpload"
                class="reset-button"
              >
                Upload Another
              </button>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PrescriptionUpload',
  data() {
    return {
      files: [],
      dragActive: false,
      uploading: false,
      uploaded: false,
      phoneNumber: '',
      deliveryAddress: '',
      showHeader: false,
      showContainer: false
    }
  },
  mounted() {
    // Stagger animations
    requestAnimationFrame(() => {
      this.showHeader = true
      setTimeout(() => (this.showContainer = true), 200)
    })
  },
  methods: {
    handleDrag(e) {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === 'dragenter' || e.type === 'dragover') {
        this.dragActive = true
      } else if (e.type === 'dragleave') {
        this.dragActive = false
      }
    },
    handleDrop(e) {
      e.preventDefault()
      e.stopPropagation()
      this.dragActive = false

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.handleFiles(Array.from(e.dataTransfer.files))
      }
    },
    handleFileChange(e) {
      if (e.target.files && e.target.files.length > 0) {
        this.handleFiles(Array.from(e.target.files))
      }
    },
    handleFiles(newFiles) {
      const validFiles = newFiles.filter(
        (file) =>
          file.type.startsWith('image/') || file.type === 'application/pdf'
      )
      this.files = [...this.files, ...validFiles]
    },
    removeFile(index) {
      this.files = this.files.filter((_, i) => i !== index)
    },
    triggerFileInput() {
      this.$refs.fileInput?.click()
    },
    async handleUpload() {
      if (this.files.length === 0) {
        this.showToast('No files selected', 'Please select prescription images to upload')
        return
      }

      this.uploading = true
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000))
      this.uploading = false
      this.uploaded = true
      this.showToast('Prescription Uploaded!', "We'll process your order and contact you shortly.")
    },
    resetUpload() {
      this.files = []
      this.uploaded = false
      this.phoneNumber = ''
      this.deliveryAddress = ''
    },
    showToast(title, description) {
      // Simple toast notification - you can enhance this with a toast library
      alert(`${title}: ${description}`)
    }
  }
}
</script>

<style scoped>
.prescription-section {
  padding: 64px 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0fdf4 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.header-content {
  max-width: 672px;
  margin: 0 auto 48px;
  text-align: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 9999px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
}

.badge i {
  font-size: 16px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.section-description {
  color: #6b7280;
  font-size: 16px;
  line-height: 1.6;
}

.upload-container {
  max-width: 672px;
  margin: 0 auto;
}

.upload-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.drop-zone {
  position: relative;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.drop-zone:hover {
  border-color: rgba(16, 185, 129, 0.5);
  background: #f0fdf4;
}

.drop-zone.drag-active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.file-input {
  display: none;
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(16, 185, 129, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper i {
  font-size: 32px;
  color: #10b981;
}

.drop-zone-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.drop-zone-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.file-list {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f3f4f6;
}

.file-icon {
  width: 20px;
  height: 20px;
  color: #10b981;
  font-size: 20px;
}

.file-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ef4444;
  transition: background 0.2s;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

.remove-btn i {
  font-size: 16px;
}

.form-fields {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-input {
  height: 48px;
  padding: 0 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  transition: border-color 0.2s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.upload-button {
  width: 100%;
  margin-top: 24px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.upload-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.upload-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.upload-button i {
  font-size: 20px;
}

.uploading-text {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Transition animations */
.fade-up-enter-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.scale-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.scale-fade-enter-to {
  opacity: 1;
  transform: scale(1);
}

.success-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 48px 32px;
  text-align: center;
}

.success-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.success-icon-wrapper i {
  font-size: 40px;
  color: #10b981;
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.success-description {
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.6;
}

.reset-button {
  padding: 12px 24px;
  background: white;
  color: #10b981;
  border: 2px solid #10b981;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.reset-button:hover {
  background: #f0fdf4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

/* Responsive Design */
@media (min-width: 768px) {
  .prescription-section {
    padding: 96px 16px;
  }

  .section-title {
    font-size: 48px;
  }

  .upload-card {
    padding: 48px;
  }
}

@media (max-width: 768px) {
  .prescription-section {
    padding: 48px 16px;
  }

  .section-title {
    font-size: 28px;
  }

  .upload-card {
    padding: 24px;
  }

  .drop-zone {
    padding: 24px;
  }

  .icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .icon-wrapper i {
    font-size: 28px;
  }
}
</style>

