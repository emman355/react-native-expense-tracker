import { ScrollView } from "react-native"
import { isWeb } from "../constants/platform"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { styles } from '../assets/styles/auth.styles'

// Wrapper that switches between web and mobile
const AuthWrapper = ({ children }) => {
    if (isWeb) {
        return (
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        )
    }

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContent}
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {children}
        </KeyboardAwareScrollView>
    )
}

export default AuthWrapper