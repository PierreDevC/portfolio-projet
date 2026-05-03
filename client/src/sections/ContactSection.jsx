import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { FiSend, FiMail, FiMapPin } from 'react-icons/fi'

export default function ContactSection() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      )
      setStatus('success')
      formRef.current.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">
          Contact
        </p>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
          Travaillons ensemble
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-6">
            <p className="text-gray-600 dark:text-gray-400">
              Vous avez un projet en tête ? N'hésitez pas à me contacter, je réponds généralement sous 24h.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <FiMail className="text-violet-600 dark:text-violet-400" size={18} />
                pscypre@gmail.com
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <FiMapPin className="text-violet-600 dark:text-violet-400" size={18} />
                Montréal, Québec, Canada
              </div>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="from_name"
              type="text"
              placeholder="Pierre"
              required
              className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <input
              name="from_email"
              type="email"
              placeholder="Votre email"
              required
              className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <textarea
              name="message"
              rows={5}
              placeholder="Votre message"
              required
              className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-lg font-medium transition-colors"
            >
              <FiSend size={16} />
              {status === 'sending' ? 'Envoi...' : 'Envoyer le message'}
            </button>
            {status === 'success' && (
              <p className="text-green-600 dark:text-green-400 text-sm text-center">
                Message envoyé avec succès !
              </p>
            )}
            {status === 'error' && (
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                Erreur lors de l'envoi. Réessayez.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}