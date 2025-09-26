import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES } from "../../constants/constants";
import PageLoader from "../../components/PageLoader";
import { useCreateServices } from "../../hooks/useCreateServices";



const CreateScreen = () => {
	const router = useRouter();
	const {
		title,
		setTitle,
		isLoading,
		handleCreate,
		isExpense,
		setIsExpense,
		amount,
		setAmount,
		selectedCategory,
		setSelectedCategory } = useCreateServices();
	return (
		<View style={styles.container}>
			{/* HEADER */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
					<Ionicons name="arrow-back" size={24} color={COLORS.text} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>New Transaction</Text>
				<TouchableOpacity
					style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
					onPress={handleCreate}
					disabled={isLoading}
				>
					<Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
					{!isLoading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
				</TouchableOpacity>
			</View>

			<View style={styles.card}>
				<View style={styles.typeSelector}>
					{/* EXPENSE SELECTOR */}
					<TouchableOpacity
						style={[styles.typeButton, isExpense && styles.typeButtonActive]}
						onPress={() => setIsExpense(true)}
					>
						<Ionicons
							name="arrow-down-circle"
							size={22}
							color={isExpense ? COLORS.white : COLORS.expense}
							style={styles.typeIcon}
						/>
						<Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>
							Expense
						</Text>
					</TouchableOpacity>

					{/* INCOME SELECTOR */}
					<TouchableOpacity
						style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
						onPress={() => setIsExpense(false)}
					>
						<Ionicons
							name="arrow-up-circle"
							size={22}
							color={!isExpense ? COLORS.white : COLORS.income}
							style={styles.typeIcon}
						/>
						<Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>
							Income
						</Text>
					</TouchableOpacity>
				</View>

				{/* AMOUNT CONTAINER */}
				<View style={styles.amountContainer}>
					<Text style={styles.currencySymbol}>₱</Text>
					<TextInput
						style={styles.amountInput}
						placeholder="0.00"
						placeholderTextColor={COLORS.textLight}
						value={amount}
						onChangeText={setAmount}
						keyboardType="numeric"
					/>
				</View>

				{/* INPUT CONTAINER */}
				<View style={styles.inputContainer}>
					<Ionicons
						name="create-outline"
						size={22}
						color={COLORS.textLight}
						style={styles.inputIcon}
					/>
					<TextInput
						style={styles.input}
						placeholder="Transaction Title"
						placeholderTextColor={COLORS.textLight}
						value={title}
						onChangeText={setTitle}
					/>
				</View>

				{/* TITLE */}
				<Text style={styles.sectionTitle}>
					<Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Category
				</Text>

				<View style={styles.categoryGrid}>
					{CATEGORIES.map((category) => (
						<TouchableOpacity
							key={category.id}
							style={[
								styles.categoryButton,
								selectedCategory === category.name && styles.categoryButtonActive,
							]}
							onPress={() => setSelectedCategory(category.name)}
						>
							<Ionicons
								name={category.icon}
								size={20}
								color={selectedCategory === category.name ? COLORS.white : COLORS.text}
								style={styles.categoryIcon}
							/>
							<Text
								style={[
									styles.categoryButtonText,
									selectedCategory === category.name && styles.categoryButtonTextActive,
								]}
							>
								{category.name}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			{isLoading && (
				<PageLoader />
			)}
		</View>
	);
};
export default CreateScreen;